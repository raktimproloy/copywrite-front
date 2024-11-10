import React, { useState, useEffect } from "react";
import Link from "next/link";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { Collapse } from "reactstrap";

import externalLink from "@/data/externallink.json";
import { postUserLogout } from "@/redux/slices/auth";
import {
  getSubscriptions,
  postCustomerPortal,
  postTrialEndInstantly,
  selectors as paymentSelector,
} from "@/redux/slices/payment";
import {
  setSubscriptionsCancelModal,
  setSubscriptionsTrailEndModal,
} from "@/redux/slices/ui";
import SubscriberModal from "@/components/modals/subscriptions/plan";
import SubscriberTrialEndModal from "@/components/modals/subscriptions/trailend";
import { useResponsive, useUser } from "@/hooks";

import { FaChevronDown } from "react-icons/fa";

const MainSidebar = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isMobile } = useResponsive();
  const { authToken, isAuth, subscribe, userInfo, isRehydrated } = useUser();
  const { firstName, lastName, email, profileAvatar } = userInfo;
  const fullName = `${firstName} ${lastName}`;
  const {
    refreshToken: { token },
  } = authToken;
  const [blogDrop, setBlogDrop] = useState(true);
  const [planDrop, setPlanDrop] = useState(true);
  const [redirectURL, setRedirectURL] = useState(null);
  const [loadingManageSubs, setLoadingManageSubs] = useState(false);
  const { items: subscriptions } = useSelector(paymentSelector.getSubscription);
  const trialSelector = useSelector(paymentSelector.getTrail);

  const handleShowSubscriptionsCancelModal = () => {
    dispatch(setSubscriptionsCancelModal(true));
  };

  const handleSignout = () => {
    dispatch(postUserLogout({ data: { refreshToken: token } })).then(
      ({ payload }) => {
        if (payload.status === 204) {
          router.push("/");
        }
      }
    );
  };

  useEffect(() => {
    isRehydrated && isAuth && dispatch(getSubscriptions({ status: "active" }));
  }, [dispatch, isAuth, isRehydrated]);

  useEffect(() => {
    if (redirectURL) window.location.href = redirectURL;
  }, [redirectURL]);

  const handleCreateCustomerPortal = () => {
    setLoadingManageSubs(true);
    !loadingManageSubs &&
      dispatch(postCustomerPortal())
        .then(({ payload }) => {
          if (payload.status === 200) {
            setRedirectURL(payload.data);
          }
        })
        .finally(() => {
          setLoadingManageSubs(false);
        });
  };

  const isTrail = subscribe.freeTrial.eligible;

  const handleInstantTrailEnd = () => {
    dispatch(setSubscriptionsTrailEndModal(true));
    // const isPending = trialSelector.loading === "pending";
    // isTrail && !isPending && dispatch(postTrialEndInstantly());
  };

  return (
    <Sidebar className={isMobile ? "col-md-12" : "col-md-3"}>
      <SidebarContainer>
        {isAuth && (
          <SidebarUser>
            <p className="sidebar-premium">
              {subscribe.subscriberInfo.isPaidSubscribers
                ? "Premium "
                : "Trial "}
              Account
            </p>
            <SidebarUserAvatar>
              {profileAvatar ? (
                <AvatarImg src={profileAvatar} alt={fullName} />
              ) : (
                <FirstCharAvatar>{firstName?.charAt(0)}</FirstCharAvatar>
              )}

              <span>{fullName}</span>
            </SidebarUserAvatar>
            <p className="sidebar-email">{email}</p>
            {isMobile && (
              <StyledLogoutButton onClick={handleSignout}>
                Logout
              </StyledLogoutButton>
            )}
          </SidebarUser>
        )}

        <SidebarUserAction>
          {!isAuth && (
            <>
              <Link href="/signin" passHref>
                <UserActionLink>Signin</UserActionLink>
              </Link>
              <Link href="/signup" passHref>
                <UserActionLink>Signup</UserActionLink>
              </Link>
            </>
          )}

          {isAuth && (
            <>
              {subscriptions.length > 0 && (
                <div>
                  <DropDownMenuTitle
                    onClick={() => setPlanDrop((prevState) => !prevState)}
                  >
                    Plan{" "}
                    <i>
                      <FaChevronDown />
                    </i>
                  </DropDownMenuTitle>
                  <Collapse isOpen={planDrop}>
                    <DropDownList>
                      {isTrail && (
                        <>
                          <li>
                            <StyledPlanItem
                              onClick={handleShowSubscriptionsCancelModal}
                            >
                              Switch Plan
                            </StyledPlanItem>
                          </li>
                          <li>
                            <StyledPlanItem
                              onClick={handleCreateCustomerPortal}
                            >
                              {loadingManageSubs ? "Loading..." : "Manage Plan"}
                            </StyledPlanItem>
                          </li>
                          {isTrail && !trialSelector.data.isSuccess && (
                            <li>
                              <StyledPlanItem onClick={handleInstantTrailEnd}>
                                {trialSelector.loading === "pending"
                                  ? "Loading..."
                                  : "End Trial"}
                              </StyledPlanItem>
                            </li>
                          )}
                        </>
                      )}
                    </DropDownList>
                  </Collapse>
                </div>
              )}
              <DropDownMenuTitle
                onClick={() => setBlogDrop((prevState) => !prevState)}
              >
                SEO Genie{" "}
                <i>
                  <FaChevronDown />
                </i>
              </DropDownMenuTitle>
              <Collapse isOpen={blogDrop}>
                <DropDownList>
                  <li>
                    <Link href="/app/ai-write-along" passHref>
                      <UserActionLink>Write along</UserActionLink>
                    </Link>
                  </li>
                  <li>
                    <Link href="/app/ai-ghostwriter" passHref>
                      <UserActionLink>Ghostwriter</UserActionLink>
                    </Link>
                  </li>
                  <li>
                    <Link href="/draft" passHref>
                      <UserActionLink>Drafts</UserActionLink>
                    </Link>
                  </li>
                </DropDownList>
              </Collapse>
              {/* <Link href="/app" passHref>
                <UserActionLink>Generate Copy</UserActionLink>
              </Link> */}
              <Link href="/bookmarks" passHref>
                <UserActionLink>Bookmarks</UserActionLink>
              </Link>
            </>
          )}
          <Link href="/user-pricing" passHref>
            <UserActionLink>Pricing</UserActionLink>
          </Link>
        </SidebarUserAction>
        <Community>
          <p>Community</p>
          <ul>
            <li>
              <a href={externalLink.facebookGroup} target="__blank">
                Facebook
              </a>
            </li>
            <li>
              <a href={externalLink.twitter}>Twitter</a>
            </li>
            <li>
              <a href={externalLink.linkedin}>LinkedIn</a>
            </li>
          </ul>
        </Community>
      </SidebarContainer>
      <SubscriberModal />
      <SubscriberTrialEndModal />
    </Sidebar>
  );
};

const SidebarLink = styled.a`
  &:hover {
    text-decoration: none;
  }
`;

const UserActionLink = styled(SidebarLink)`
  color: #000;
  font-weight: 500;

  &:hover {
    color: #000;
  }
`;

const Sidebar = styled.div`
  border-right: 1px solid #b4b4b4;
  min-height: 100vh;

  @media (max-width: 1000px) {
    border: 0;
  }
`;

const DropDownMenuTitle = styled.p`
  color: #000;
  cursor: pointer;
  font-weight: 500;
`;

const DropDownList = styled.ul`
  list-style: none;
  padding-left: 5px;
`;

const SidebarContainer = styled.div`
  padding-top: 1rem;
  margin-left: 1.4rem;
  margin-right: 1.4rem;
`;

const SidebarSection = styled.div`
  border-bottom: 1px solid #b4b4b4;
  padding: 1.2rem 0;

  p {
    margin: 0;
  }
`;

const SidebarUser = styled(SidebarSection)`
  .sidebar-premium {
    font-size: 17px;
    font-weight: 500;
  }
  .sidebar-email {
    font-size: 14px;
    margin-top: 0.5rem;
  }
`;

const SidebarUserAvatar = styled.div`
  display: flex;
  align-items: center;
  margin-top: 1.5rem;

  span {
    margin-left: 0.5rem;
    font-size: 20px;
    font-weight: 500;
  }
`;

const AvatarImg = styled.img`
  border-radius: 50%;
  height: 20px;
  object-fit: contain;
  width: 20px;
`;

const StyledLogoutButton = styled.button`
  background-color: white;
  border-radius: 5px;
  border: 1px solid black;
  margin-top: 10px;
  outline: 0;
  padding: 4px 15px;
`;

const FirstCharAvatar = styled.div`
  align-items: center;
  background-color: #13b567;
  border-radius: 50%;
  color: #fff;
  display: flex;
  height: 20px;
  justify-content: center;
  text-transform: uppercase;
  width: 20px;
`;

const SidebarUserAction = styled(SidebarSection)`
  display: flex;
  flex-direction: column;
  min-height: 6rem;
  justify-content: space-between;
`;

const Community = styled(SidebarSection)`
  border: 0;
  p {
    font-weight: 500;
  }
  ul {
    list-style-type: none;
    padding: 0;

    li {
      font-size: 14px;
      margin: 5px 0;

      a {
        color: black;
        text-decoration: none;
      }
    }
  }
`;

const StyledPlanItem = styled.div`
  cursor: pointer;
  color: #000;
  font-weight: 500;
`;

export default MainSidebar;
